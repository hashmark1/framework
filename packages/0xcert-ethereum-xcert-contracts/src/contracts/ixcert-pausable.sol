pragma solidity 0.5.1;

/**
 * @dev Xcert pausable interface.
 */
interface XcertPausable // is Xcert
{

  /**
   * @dev Sets if Xcerts are paused or not.
   * @param _isPaused Pause status.
   */
  function setPause(
    bool _isPaused
  )
    external;
    
}